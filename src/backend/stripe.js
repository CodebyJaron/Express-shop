const stripe = require('stripe')(require('../../config.json').stripeSecret);

module.exports = {
    async createInvoice(customerId, amount, description) {
        try {
            const invoice = await stripe.invoices.create({
                customer: customerId,
                amount: amount,
                description: description,
                currency: 'usd',
                auto_advance: true,
            });
            return invoice;
        } catch (error) {
            throw error;
        }
    },

    async getInvoice(invoiceId) {
        try {
            const invoice = await stripe.invoices.retrieve(invoiceId);
            return invoice;
        } catch (error) {
            throw error;
        }
    },

    async isInvoicePaid(invoiceId) {
        try {
            const invoice = await this.getInvoice(invoiceId);
            return invoice.status === 'paid';
        } catch (error) {
            throw error;
        }
    },
};
