// utils/requestUtils.js
import { getUser } from '../app/User';
import { getDoc } from 'firebase/firestore';

export const fetchRequestsCount = async () => {
    const user = await getUser();
    const userDocRef = user.docRef;
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const requestedBy = userData.requestedBy || [];
        return requestedBy.length;
    }
    return 0;
};
