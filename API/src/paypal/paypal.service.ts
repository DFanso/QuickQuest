import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
  private paypalClient: paypal.core.PayPalHttpClient;

  constructor(private configService: ConfigService) {
    const environment = new paypal.core.SandboxEnvironment(
      this.configService.get('PAYPAL_CLIENT_ID'),
      this.configService.get('PAYPAL_CLIENT_SECRET'),
    );
    this.paypalClient = new paypal.core.PayPalHttpClient(environment);
  }

  async createJob(details: {
    name: string;
    unit_price: string;
    quantity: string;
    jobId: string;
  }): Promise<string> {
    const unitPrice = parseFloat(details.unit_price);
    const quantity = parseInt(details.quantity);
    const itemTotal = unitPrice * quantity;
    const totalAmount = itemTotal.toFixed(2);
  
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalAmount,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalAmount,
              },
            },
          },
          items: [
            {
              name: details.name,
              unit_amount: {
                currency_code: 'USD',
                value: unitPrice.toFixed(2),
              },
              quantity: quantity.toString(),
            },
          ],
          custom_id: details.jobId,
        },
      ],
      application_context: {
        return_url: `${this.configService.get('FRONTEND_URL')}/payment-success`,
        cancel_url: `${this.configService.get('FRONTEND_URL')}/payment-cancel`,
      },
    });

    try {
      const response = await this.paypalClient.execute(request);
      const order = response.result;
      const approvalUrl = order.links.find(
        (link) => link.rel === 'approve',
      ).href;
      return approvalUrl;
    } catch (err) {
      throw new Error(`Error creating PayPal order: ${err.message}`);
    }
  }
}
