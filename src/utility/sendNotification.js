import { getMessaging } from "firebase-admin/messaging";

export const adminSendNotification = async ({token, title, body, data = {}}) => {
    try {
        const message = {
            token,
            notification: {
                title,
                body,
            },
            data,
        }
        const response = await getMessaging().send(message);
        console.log("Successfully sent message:", response);
        return response;
    } catch (error) {
        console.log("error in sending notification", error);
        return error;
    }
};