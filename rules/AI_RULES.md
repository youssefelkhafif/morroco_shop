# Morocco Shop — Project Rules

## Stack

- Laravel is the backend authority.
- Inertia with React is the frontend.
- Keep Laravel, Inertia, Fortify, settings, and shared generic UI infrastructure.
- Never restore Academy business logic.

## Payment and ordering

- Cash on Delivery only.
- Do not add Stripe, card collection, or online payment flows.
- The customer creates the order on the website first.
- Laravel stores the order before WhatsApp opens.
- WhatsApp opens with a prepared confirmation message.
- Customers pay only when the delivery arrives.

## Checkout

- Guest checkout is the default.
- Never force a customer to create an account before ordering.
- Login and registration remain optional.
- Accounts are used for order history, saved addresses, and faster checkout.

## Security and prices

- Laravel calculates all prices, delivery fees, subtotals, and final totals.
- Never trust a product price or total sent by React.
- Use validation requests and database transactions for order creation.
- Store historical product names and prices in order items.

## Stock

- Do not reduce stock when a guest creates an order.
- Reduce stock only after the admin confirms the WhatsApp order.

## Order status pipeline

- pending_whatsapp_confirmation
- confirmed
- preparing
- shipped
- delivered
- cancelled
- no_answer
- refused_at_delivery
- returned

## Admin

- Admin manages products, categories, images, stock, delivery zones and fees.
- Admin manages orders, customers, order status, and analytics.
- Admin can open the customer WhatsApp conversation from an order.

## Cleanup

- Remove every legacy learning-platform feature, old learning data, old staff logic, old tracking code, and old platform branding.
- Do not leave unreachable Academy pages, components, routes, controllers, models, migrations, factories, seeders, services, or tests.
- Remove code progressively and verify each cleanup stage with build/tests before continuing.
