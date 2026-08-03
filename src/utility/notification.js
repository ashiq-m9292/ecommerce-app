import { getMessaging } from "firebase-admin/messaging";

export const sendNotification = async ({ token, data = {} }) => {
    try {
        const message = {
            token,
            data,
        };
        const response = await getMessaging().send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.log('error in sending notification', error);
        return;
    }
};

// multiple user ke liye notification send karne ka function
export const sendNotificationToMultipleUsers = async ({ tokens, data = {} }) => {
    try {
        const message = {
            tokens,
            data,
        };
        const response = await getMessaging().sendEachForMulticast(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.log('error in sending notification', error);
        return;
    }
};