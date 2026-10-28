/** What the checkout APIs return for the browser to post to CCAvenue. */
export interface CcAvenueCheckoutData {
  orderId: string;
  gatewayUrl: string;
  accessCode: string;
  encRequest: string;
}

/** Sends the browser to CCAvenue with the encrypted order; the page navigates away. */
export function redirectToCcAvenue({ gatewayUrl, accessCode, encRequest }: CcAvenueCheckoutData) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = gatewayUrl;
  for (const [name, value] of Object.entries({ encRequest, access_code: accessCode })) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
