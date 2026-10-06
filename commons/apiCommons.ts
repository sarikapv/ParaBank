import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../config/config';

// API equivalent of webCommons: it knows WHERE each endpoint is and sends the request.
// It returns the raw response. All assertions stay in the spec files.
// Mantain all end points 

export class ApiClient {

  private readonly baseApiUrl: string;
  constructor(private readonly request: APIRequestContext) {
    // BASE_URL in .env is the app address; the API lives under /parabank/services/bank on the same host
    this.baseApiUrl = `${new URL(config.baseUrl).origin}/parabank/services/bank`;
  }

  async login(username: string, password: string): Promise<APIResponse> {
    return this.request.get(`${this.baseApiUrl}/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`);
  }

  async getCustomerID(customerId: string): Promise<APIResponse> {
    return this.request.get(`${this.baseApiUrl}/customers/${customerId}`,
      {
        headers: {
          Accept: 'application/xml'
        }
      }
    );
  }

  async getCustomerAccounts(customerID: string): Promise<APIResponse> {
    return this.request.get(
      `${this.baseApiUrl}/customers/${customerID}/accounts`,
      {
        headers: {
          'Accept': 'application/xml'
        }
      }
    );
  }
  async getAccount(accountId: string): Promise<APIResponse> {
    return this.request.get(`${this.baseApiUrl}/accounts/${accountId}`,
      {
        headers: {
          'Accept': 'application/xml'
        }
      }
    );
  }

  async createAccount(customerId: string, newAccountType: string, fromAccountId: string): Promise<APIResponse> {
    return this.request.post(`${this.baseApiUrl}/createAccount`, {
      params: { customerId, newAccountType, fromAccountId },
      headers: { Accept: 'application/xml' },
    });
  }

  async postAccount(fromAccountID: string, toAccountId: string, amount: string) {
    return this.request.post(`${this.baseApiUrl}/transfer`, {
      params: {
        fromAccountId: fromAccountID,
        toAccountId: toAccountId,
        amount
      },
      headers: { Accept: 'application/xml' },
    });

  }

  async postTransferMissingToAccount(fromAccountID: string, amount: string): Promise<APIResponse> {
    return this.request.post(`${this.baseApiUrl}/transfer`, {
      params: {
        fromAccountId: fromAccountID,
        amount
      },
      headers: {
        Accept: 'application/xml'
      }
    });
  }

  // async postBillPay(accountID:string,amount:string,payeeName:string){
  //   return this.request.post(`${this.baseApiUrl}/billpay`, {
  //         params: {
  //             accountID: accountID,
  //             payeeName,
  //             amount
  //         },
  //         headers: {
  //             Accept: 'application/xml'
  //         }
  //     });
  // }
  async postBillPay(accountID: string,amount: string,payee: object): Promise<APIResponse> {

    return this.request.post(`${this.baseApiUrl}/billpay`, {
        params: {
            accountId: accountID,
            amount: amount
        },
        headers: {
            'Accept': 'application/xml',
            'Content-Type': 'application/json'
        },
        data: payee
    });
}

async getAccountTransactions(accountID: string): Promise<APIResponse> {
    return this.request.get(`${this.baseApiUrl}/accounts/${accountID}/transactions`,
        {
            headers: {
                'Accept': 'application/xml'
            }
        }
    );
}
async getTransactionsByMonthAndType(accountID: string,month: string,type: string): Promise<APIResponse> {
    return this.request.get(
        `${this.baseApiUrl}/accounts/${accountID}/transactions/month/${month}/type/${type}`,
        {
            headers: {
                'Accept': 'application/xml'
            }
        }
    );
}

async updateCustomer(customerID: string,firstName: string,lastName: string,street: string,city: string,state: string,zipCode: string,
   phoneNumber: string,ssn: string,username: string,password: string): Promise<APIResponse> {

    return this.request.post(`${this.baseApiUrl}/customers/update/${customerID}`,
        {
            params: {
                firstName,
                lastName,
                street,
                city,
                state,
                zipCode,
                phoneNumber,
                ssn,
                username,
                password
            },
            headers: {
                'Accept': 'application/xml'
            }
        }
    );
}
}

