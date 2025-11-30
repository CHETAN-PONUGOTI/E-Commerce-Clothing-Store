import nodemailer from 'nodemailer';

const sendOrderConfirmationEmail = async (order, user) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Order Confirmation - #${order._id}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h1 style="color: #333;">🎉 Thank you for your order!</h1>
                <p>Your order details are below:</p>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                <hr/>
                <h3>Items Purchased:</h3>
                <ul style="list-style-type: none; padding: 0;">
                    ${order.items.map(item => `
                        <li style="margin-bottom: 10px; border-bottom: 1px dotted #eee; padding-bottom: 5px;">
                            ${item.name} (${item.size}) &times; ${item.qty} 
                            <span style="float: right;">$${(item.price * item.qty).toFixed(2)} ($${item.price.toFixed(2)} each)</span>
                        </li>
                    `).join('')}
                </ul>
                <hr/>
                <h2 style="color: #007bff;">Total Amount: $${order.totalPrice.toFixed(2)}</h2>
                <p>We will notify you when your order ships.</p>
                <p>Regards,<br/>The Clothing Store Team</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send order confirmation email.');
    }
};

export { sendOrderConfirmationEmail };