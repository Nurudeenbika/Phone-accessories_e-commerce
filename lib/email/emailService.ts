import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: `"Jespo Gadgets" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  async sendOrderConfirmationEmail(
    orderData: any,
    userEmail: string,
  ): Promise<boolean> {
    const subject = `Order Confirmation - #${orderData.id}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px 0; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .product-item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .total { font-weight: bold; font-size: 18px; color: #2563eb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your purchase at Jespo Gadgets</p>
          </div>
          
          <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
              <p><strong>Order ID:</strong> #${orderData.id}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> ${orderData.status}</p>
              <p><strong>Total Amount:</strong> ₦${orderData.totalAmount?.toLocaleString()}</p>
            </div>

            <h3>Shipping Address</h3>
            <div class="order-details">
              <p>${orderData.address?.firstName} ${orderData.address?.lastName}</p>
              <p>${orderData.address?.address}</p>
              <p>${orderData.address?.city}, ${orderData.address?.state}</p>
              <p>${orderData.address?.phone}</p>
            </div>

            <h3>Order Items</h3>
            ${orderData.products
              ?.map(
                (product: any) => `
              <div class="product-item">
                <p><strong>${product.name}</strong></p>
                <p>Quantity: ${product.quantity}</p>
                <p>Price: ₦${product.price?.toLocaleString()}</p>
              </div>
            `,
              )
              .join("")}

            <div class="total">
              <p>Total: ₦${orderData.totalAmount?.toLocaleString()}</p>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with Jespo Gadgets!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendOrderStatusUpdateEmail(
    orderData: any,
    userEmail: string,
    newStatus: string,
  ): Promise<boolean> {
    const subject = `Order Status Update - #${orderData.id}`;

    const statusMessages: { [key: string]: string } = {
      pending: "Your order is being processed",
      processing: "Your order is being prepared",
      shipped: "Your order has been shipped",
      delivered: "Your order has been delivered",
      cancelled: "Your order has been cancelled",
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Status Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; }
          .content { padding: 20px 0; }
          .status-update { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .order-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📦 Order Status Update</h1>
            <p>Your order status has been updated</p>
          </div>
          
          <div class="content">
            <div class="status-update">
              <h2>${statusMessages[newStatus] || "Your order status has been updated"}</h2>
              <p><strong>New Status:</strong> ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</p>
            </div>

            <div class="order-details">
              <p><strong>Order ID:</strong> #${orderData.id}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₦${orderData.totalAmount?.toLocaleString()}</p>
            </div>

            ${
              newStatus === "shipped"
                ? `
              <p>Your order is on its way! You can track your package using the order ID.</p>
            `
                : newStatus === "delivered"
                  ? `
              <p>Your order has been successfully delivered. Thank you for your purchase!</p>
            `
                  : ""
            }
          </div>

          <div class="footer">
            <p>Thank you for shopping with Jespo Gadgets!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }
}

export const emailService = new EmailService();
