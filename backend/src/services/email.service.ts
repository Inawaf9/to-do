import { Resend } from 'resend';



const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(from: string, to: string, subject: string, html: string) {
    const {data, error} = await resend.emails.send({
            from: `${from}`,
            to: [`${to}`],
            subject: `${subject}`,
            html: `${html}`,
        });
        console.log(data, error);
}