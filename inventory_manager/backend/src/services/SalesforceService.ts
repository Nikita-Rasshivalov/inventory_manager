import { PrismaClient } from "@prisma/client";
import jsforce from "jsforce";

interface SalesforcePayload {
  company?: string;
  position?: string;
  phone?: string;
  [key: string]: any;
}

export class SalesforceService {
  private prisma = new PrismaClient();
  private conn: jsforce.Connection;
  private isLoggedIn = false;

  constructor() {
    this.conn = new jsforce.Connection({
      loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
    });
  }

  private async login() {
    if (!this.isLoggedIn) {
      await this.conn.login(
        process.env.SF_USERNAME!,
        process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!
      );
      this.isLoggedIn = true;
    }
  }

  async createAccountAndContact(
    userId: number,
    data: SalesforcePayload
  ): Promise<{ accountId: string; contactId: string; message: string }> {
    await this.login();

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.salesforceAccountId && user.salesforceContactId) {
      return {
        accountId: user.salesforceAccountId,
        contactId: user.salesforceContactId,
        message: "Account and Contact already exist (from local DB)",
      };
    }

    const existingContacts = await this.conn
      .sobject("Contact")
      .find({ Email: user.email }, ["Id", "AccountId"])
      .limit(1);

    if (existingContacts.length > 0) {
      const existingContact = existingContacts[0];
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          salesforceAccountId: existingContact.AccountId
            ? String(existingContact.AccountId)
            : null,
          salesforceContactId: existingContact.Id
            ? String(existingContact.Id)
            : null,
        },
      });

      return {
        accountId: existingContact.AccountId
          ? String(existingContact.AccountId)
          : "",
        contactId: existingContact.Id ? String(existingContact.Id) : "",
        message: "Account and Contact already exist in Salesforce",
      };
    }

    let accountId: string;
    const existingAccounts = await this.conn
      .sobject("Account")
      .find({ Name: data.company || user.name }, ["Id"])
      .limit(1);

    if (existingAccounts.length > 0) {
      accountId = String(existingAccounts[0].Id);
    } else {
      const accountResult = await this.conn.sobject("Account").create({
        Name: data.company || user.name,
        Phone: data.phone,
      });

      if (!accountResult.success) {
        console.error(accountResult);
        throw new Error("Failed to create Salesforce account");
      }

      accountId = String(accountResult.id);
    }

    const contactResult = await this.conn.sobject("Contact").create({
      LastName: user.name,
      Email: user.email,
      Phone: data.phone,
      Title: data.position,
      AccountId: accountId,
    });

    if (!contactResult.success) {
      console.error(contactResult);
      throw new Error("Failed to create Salesforce contact");
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        salesforceAccountId: accountId,
        salesforceContactId: String(contactResult.id),
      },
    });

    return {
      accountId,
      contactId: String(contactResult.id),
      message: "Account and Contact created successfully",
    };
  }

  async getAccountAndContact(userId: number) {
    await this.login();

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.salesforceAccountId || !user.salesforceContactId) {
      throw new Error("No Salesforce records linked");
    }

    const account = await this.conn
      .sobject("Account")
      .retrieve(user.salesforceAccountId);

    const contact = await this.conn
      .sobject("Contact")
      .retrieve(user.salesforceContactId);

    return { account, contact };
  }

  async updateAccountAndContact(userId: number, data: SalesforcePayload) {
    await this.login();

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.salesforceAccountId || !user.salesforceContactId) {
      throw new Error("No Salesforce records linked");
    }

    const accountResult = await this.conn.sobject("Account").update({
      Id: user.salesforceAccountId,
      Name: data.company || user.name,
      Phone: data.phone,
    });

    if (!accountResult.success) {
      console.error(accountResult);
      throw new Error("Failed to update Salesforce account");
    }

    const contactResult = await this.conn.sobject("Contact").update({
      Id: user.salesforceContactId,
      LastName: user.name,
      Title: data.position,
      Phone: data.phone,
    });

    if (!contactResult.success) {
      console.error(contactResult);
      throw new Error("Failed to update Salesforce contact");
    }

    return { accountResult, contactResult };
  }
}
