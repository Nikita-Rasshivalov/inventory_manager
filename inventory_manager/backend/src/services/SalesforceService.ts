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

  constructor() {
    this.conn = new jsforce.Connection({
      loginUrl: process.env.SF_LOGIN_URL || "https://login.salesforce.com",
    });

    this.conn.login(
      process.env.SF_USERNAME!,
      process.env.SF_PASSWORD! + process.env.SF_SECURITY_TOKEN!
    );
  }

  async createAccountAndContact(
    userId: number,
    data: SalesforcePayload
  ): Promise<{ accountId: string; contactId: string; message: string }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    if (user.salesforceAccountId && user.salesforceContactId) {
      return {
        accountId: user.salesforceAccountId,
        contactId: user.salesforceContactId,
        message: "Account and Contact already exist",
      };
    }
    const accountResult = await this.conn.sobject("Account").create({
      Name: data.company || user.name,
      Phone: data.phone,
    });

    if (!accountResult.success) {
      throw new Error("Failed to create Salesforce account");
    }

    const contactResult = await this.conn.sobject("Contact").create({
      LastName: user.name,
      Email: user.email,
      Phone: data.phone,
      Title: data.position,
      AccountId: accountResult.id,
    });

    if (!contactResult.success) {
      throw new Error("Failed to create Salesforce contact");
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        salesforceAccountId: accountResult.id,
        salesforceContactId: contactResult.id,
      },
    });

    return {
      accountId: accountResult.id,
      contactId: contactResult.id,
      message: "Account and Contact created successfully",
    };
  }

  async getAccountAndContact(userId: number) {
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
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.salesforceAccountId || !user.salesforceContactId) {
      throw new Error("No Salesforce records linked");
    }

    const accountResult = await this.conn.sobject("Account").update({
      Id: user.salesforceAccountId,
      Name: data.company,
      Phone: data.phone,
    });

    const contactResult = await this.conn.sobject("Contact").update({
      Id: user.salesforceContactId,
      LastName: user.name,
      Title: data.position,
      Phone: data.phone,
    });

    return { accountResult, contactResult };
  }
}
