// // import React, { useEffect, useState } from 'react';
// // import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
// // import { useFocusEffect } from '@react-navigation/native';
// // import { getUser, getToken } from '../../User';
// // import { getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
// // import { ref, usersColRef } from '../../../firebase';
// // import Feather from 'react-native-vector-icons/Feather';
// // import CircleCheckIcon from '../../../components/CircleCheckIcon';
// // import CircleCrossIcon from '../../../components/CircleCrossIcon';


// // export default function RequestsScreen() {
// //     const [requests, setRequests] = useState([]);
// //     const [loading, setLoading] = useState(true);

   
// //         async function fetchRequests() {
// //             const user = await getUser();
// //             const userDocRef = user.docRef;
// //             console.log(userDocRef);
// //             const userDocSnap = await getDoc(userDocRef);
// //             console.log("the userDocSnap: ", userDocSnap);

// //             if (userDocSnap.exists()) {
// //                 const userData = userDocSnap.data();
// //                 const requestedBy = userData.requestedBy || [];
                
// //                 const requestDocs = await Promise.all(
// //                     requestedBy.map(async (docRef) => {
// //                         const docSnap = await getDoc(docRef);
// //                         if (docSnap.exists()) {
// //                             return { ...docSnap.data(), docRef };
// //                         }
// //                         return null;
// //                     })
// //                 );

// //                 const filteredRequests = requestDocs.filter(doc => doc !== null);
// //                 console.log("Fetched Requests: ", filteredRequests);
// //                 setRequests(filteredRequests);
                
// //                 setLoading(false);
// //             } else {
// //                 console.log("no userDocSnap");
// //             }
// //         };

// //         useFocusEffect(
// //             React.useCallback(() => {
// //                 fetchRequests();
// //             }, [])
// //         );
    
    

// //     const handleAccept = async (requestDocRef) => {
// //         const user = await getUser();
// //         const userDocRef = user.docRef;

// //         await updateDoc(userDocRef, {
// //             matched: arrayUnion(requestDocRef),
// //             requestedBy: arrayRemove(requestDocRef),
// //             sentRequest: arrayRemove(requestDocRef)
            
// //         });

// //         await updateDoc(requestDocRef, {
// //             matched: arrayUnion(userDocRef),
// //             requestedBy: arrayRemove(userDocRef),
// //             sentRequest: arrayRemove(userDocRef)
// //         });

// //         setRequests(prevRequests => prevRequests.filter(req => req.docRef !== requestDocRef));
// //     };


// //     const handleDecline = async (requestDocRef) => {
// //         const user = await getUser();
// //         const userDocRef = ref(user.email);

// //         await updateDoc(userDocRef, {
// //             requestedBy: arrayRemove(requestDocRef),
// //             rejected: arrayUnion(requestDocRef)
// //         });

// //         await updateDoc(requestDocRef, {
// //             sentRequest: arrayRemove(userDocRef)

// //         })

// //         setRequests(prevRequests => prevRequests.filter(req => req.docRef !== requestDocRef));
// //     };

// //     if (loading) {
// //         return (
// //             <View style={styles.container}>
// //                 <Text>Loading...</Text>
// //             </View>
// //         );
// //     }

// //     if (!requests || requests.length === 0) {
// //         return (
// //             <View style={styles.container}>
// //                 <Text>No users yet!</Text>
// //             </View>
// //         );
// //     }

// //     return (
       
// //         <View style={styles.container}>
// //             <FlatList
// //                 data={requests}
// //                 keyExtractor={(item) => item.docRef.id}
// //                 renderItem={({ item }) => (
                   
// //                         <View style={styles.requestContainer}>
// //                             <Image source={{ uri: item.imageUrl }} style={styles.image} />
// //                             <Text style={styles.name}>{item.firstName}</Text>
// //                             <View style={styles.iconsContainer}>
// //                                 <TouchableOpacity onPress={() => handleDecline(item.docRef)} style={styles.button}>
// //                                     <CircleCrossIcon />
// //                                 </TouchableOpacity>
// //                                 <TouchableOpacity onPress={() => handleAccept(item.docRef)} style={styles.button}>
// //                                     <CircleCheckIcon />
// //                                 </TouchableOpacity>
// //                             </View>
// //                         </View>
                    
// //                 )}
// //                 ItemSeparatorComponent={() => <View style={styles.separator} />}
// //             />
// //         </View>
// //     );

// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         padding: 10,
// //         backgroundColor: '#FAF4EC',

// //     },
// //     requestContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 10,
// //         paddingHorizontal: 15,
// //     },
// //     image: {
// //         width: 55,
// //         height: 55,
// //         borderRadius: 28,
// //         marginRight: 12,
// //     },
// //     name: {
// //         fontSize: 18,
// //         fontWeight: 'bold',
// //         flex: 1,
// //     },
// //     iconsContainer: {
// //         flexDirection: 'row',
// //     },
// //     button: {
// //         marginHorizontal: 12,
// //     },
// //     separator: {
// //         height: 1,
// //         width: '100%',
// //         backgroundColor: '#ccc',
// //     },
// // });


// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
// import { useFocusEffect } from '@react-navigation/native';
// import { getUser, getToken } from '../../User';
// import { getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
// import { ref, usersColRef } from '../../../firebase';
// import Feather from 'react-native-vector-icons/Feather';
// import CircleCheckIcon from '../../../components/CircleCheckIcon';
// import CircleCrossIcon from '../../../components/CircleCrossIcon';

// export const fetchRequestsCount = async () => {
//     const user = await getUser();
//     const userDocRef = user.docRef;
//     const userDocSnap = await getDoc(userDocRef);

//     if (userDocSnap.exists()) {
//         const userData = userDocSnap.data();
//         const requestedBy = userData.requestedBy || [];
//         return requestedBy.length;
//     }
//     return 0;
// };

// export default function RequestsScreen() {
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);

//     async function fetchRequests() {
//         const user = await getUser();
//         const userDocRef = user.docRef;
//         const userDocSnap = await getDoc(userDocRef);

//         if (userDocSnap.exists()) {
//             const userData = userDocSnap.data();
//             const requestedBy = userData.requestedBy || [];

//             const requestDocs = await Promise.all(
//                 requestedBy.map(async (docRef) => {
//                     const docSnap = await getDoc(docRef);
//                     if (docSnap.exists()) {
//                         return { ...docSnap.data(), docRef };
//                     }
//                     return null;
//                 })
//             );

//             const filteredRequests = requestDocs.filter(doc => doc !== null);
//             setRequests(filteredRequests);
//             setLoading(false);
//         }
//     };

//     useFocusEffect(
//         React.useCallback(() => {
//             fetchRequests();
//         }, [])
//     );

//     const handleAccept = async (requestDocRef) => {
//         const user = await getUser();
//         const userDocRef = user.docRef;

//         await updateDoc(userDocRef, {
//             matched: arrayUnion(requestDocRef),
//             requestedBy: arrayRemove(requestDocRef),
//             sentRequest: arrayRemove(requestDocRef)
//         });

//         await updateDoc(requestDocRef, {
//             matched: arrayUnion(userDocRef),
//             requestedBy: arrayRemove(userDocRef),
//             sentRequest: arrayRemove(userDocRef)
//         });

//         setRequests(prevRequests => prevRequests.filter(req => req.docRef !== requestDocRef));
//     };

//     const handleDecline = async (requestDocRef) => {
//         const user = await getUser();
//         const userDocRef = ref(user.email);

//         await updateDoc(userDocRef, {
//             requestedBy: arrayRemove(requestDocRef),
//             rejected: arrayUnion(requestDocRef)
//         });

//         await updateDoc(requestDocRef, {
//             sentRequest: arrayRemove(userDocRef)
//         });

//         setRequests(prevRequests => prevRequests.filter(req => req.docRef !== requestDocRef));
//     };

//     if (loading) {
//         return (
//             <View style={styles.container}>
//                 <Text>Loading...</Text>
//             </View>
//         );
//     }

//     if (!requests || requests.length === 0) {
//         return (
//             <View style={styles.container}>
//                 <Text>No users yet!</Text>
//             </View>
//         );
//     }

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={requests}
//                 keyExtractor={(item) => item.docRef.id}
//                 renderItem={({ item }) => (
//                     <View style={styles.requestContainer}>
//                         <Image source={{ uri: item.imageUrl }} style={styles.image} />
//                         <Text style={styles.name}>{item.firstName}</Text>
//                         <View style={styles.iconsContainer}>
//                             <TouchableOpacity onPress={() => handleDecline(item.docRef)} style={styles.button}>
//                                 <CircleCrossIcon />
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={() => handleAccept(item.docRef)} style={styles.button}>
//                                 <CircleCheckIcon />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 )}
//                 ItemSeparatorComponent={() => <View style={styles.separator} />}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 10,
//         backgroundColor: '#FAF4EC',
//     },
//     requestContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//     },
//     image: {
//         width: 55,
//         height: 55,
//         borderRadius: 28,
//         marginRight: 12,
//     },
//     name: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         flex: 1,
//     },
//     iconsContainer: {
//         flexDirection: 'row',
//     },
//     button: {
//         marginHorizontal: 12,
//     },
//     separator: {
//         height: 1,
//         width: '100%',
//         backgroundColor: '#ccc',
//     },
// });

//screens/SideBarScreen/RequestsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUser } from '../../User';
import { getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { ref } from '../../../firebase';
import CircleCheckIcon from '../../../components/CircleCheckIcon';
import CircleCrossIcon from '../../../components/CircleCrossIcon';
import { fetchRequestsCount } from '../../../utils/requestUtils'; // Adjust the path as needed

export default function RequestsScreen() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    async function fetchRequests() {
        const user = await getUser();
        const userDocRef = user.docRef;
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const requestedBy = userData.requestedBy || [];

            const requestDocs = await Promise.all(
                requestedBy.map(async (docRef) => {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        return { ...docSnap.data(), docRef };
                    }
                    return null;
                })
            );

            const filteredRequests = requestDocs.filter(doc => doc !== null);
            setRequests(filteredRequests);
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchRequests();
        }, [])
    );

    const updateSidebarRequestsCount = async () => {
        const count = await fetchRequestsCount();
        navigation.setParams({ requestCount: count });
    };

    const handleAccept = async (requestDocRef) => {
        const user = await getUser();
        const userDocRef = user.docRef;

        await updateDoc(userDocRef, {
            matched: arrayUnion(requestDocRef),
            requestedBy: arrayRemove(requestDocRef),
            sentRequest: arrayRemove(requestDocRef)
        });

        await updateDoc(requestDocRef, {
            matched: arrayUnion(userDocRef),
            requestedBy: arrayRemove(userDocRef),
            sentRequest: arrayRemove(userDocRef)
        });

        setRequests(prevRequests => prevRequests.filter(req => req.docRef !== requestDocRef));
        updateSidebarRequestsCount();
    };

    const handleDecline = async (requestDocRef) => {
        const user = await getUser();
        const userDocRef = ref(user.email);

        await updateDoc(userDocRef, {
            requestedBy: arrayRemove(requestDocRef),
            rejected: arrayUnion(requestDocRef)
        });

        await updateDoc(requestDocRef, {
            sentRequest: arrayRemove(userDocRef)
        });

        setRequests(prevRequests => prevRequests.filter(req => req.docRef !== requestDocRef));
        updateSidebarRequestsCount();
    };

    useEffect(() => {
        const userListener = async () => {
            const user = await getUser();
            const userDocRef = user.docRef;
            onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    fetchRequests();
                }
            });
        };
        userListener();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!requests || requests.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No users yet!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.docRef.id}
                renderItem={({ item }) => (
                    <View style={styles.requestContainer}>
                        <Image source={{ uri: item.imageUrl }} style={styles.image} />
                        <Text style={styles.name}>{item.firstName}</Text>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => handleDecline(item.docRef)} style={styles.button}>
                                <CircleCrossIcon />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleAccept(item.docRef)} style={styles.button}>
                                <CircleCheckIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FAF4EC',
    },
    requestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 28,
        marginRight: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
    },
    iconsContainer: {
        flexDirection: 'row',
    },
    button: {
        marginHorizontal: 12,
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#ccc',
    },
});
