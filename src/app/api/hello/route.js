import { OAuth2Client } from "google-auth-library";
import { NextResponse } from "next/server";

// export async function GET(request){
//     return new Response('Hello, Next.js!');
// }

export async function POST(request) {
    const body = await request.json();
    const client = new OAuth2Client("162831488516-io4v72ialp9v348p7ntqnqaijk2i3shd.apps.googleusercontent.com");
    if (!body) {
        const response = NextResponse.json({
            message: "Invalid body",
        },
            {
                status: 400,
            }
        );
        return response;
    }

        async function verify(body){
            const ticket = await client.verifyIdToken({
                idToken: body.token,
                audience : "162831488516-io4v72ialp9v348p7ntqnqaijk2i3shd.apps.googleusercontent.com"
            });

            const payload = ticket.getPayload();
            return payload;
        }

        try{
            const payload = await verify(body);
            return NextResponse.json(payload);
        }catch(error) {
            const response = NextResponse.json(
                {
                    code: 400,
                    message: error instanceof Error? error.message : "Unknown"
                },
                {
                    status: 400,
                }
            );
            return response;
        }
}