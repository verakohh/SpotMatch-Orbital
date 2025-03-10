// import { TouchableOpacity, Text, StyleSheet} from "react-native";

// type ButtonProps = {
//     type: "primary" | "secondary" | "danger";
//     size: 's' | 'm' | 'l';
//     text: string;
//     onPress: ()=> void;
// };

// const Button = ({type, size, text, onPress}: ButtonProps) => {
//     const backgroundColour= type === 'primary' ? '#2196F3' : type === 'secondary' ? 'lightgray' : 'red';
//     const textColour= type === 'primary' || type === 'danger' ? 'white' : 'dimgray';
//     const buttonWidth= size === 's' ? '25%' : size === "m" ? '50%' : "100%";
//     const height = size === "s" ? 30 : size === "m" ? 40 : 60;
//     return (
//         <TouchableOpacity
//             onPress={onPress}
//             style={[styles.button, {backgroundColor: backgroundColour}, {width: buttonWidth}, {height: height} ]}
//         >
//             <Text style={[styles.text, {color: textColour} ]}>{text}</Text>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     button: {
//         fontStyle: 'italic',
//         margin: 5,
//         paddingVertical: 5,
//         paddingHorizontal: 8,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderRadius: 8,
//     },

//     text: {
//         fontWeight: 'bold',
//     }


// });

// export default Button;
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type ButtonProps = {
    type: "primary" | "secondary" | "danger";
    size: 's' | 'm' | 'l';
    text: string;
    onPress: () => void;
    style?: ViewStyle;
};

const Button = ({ type, size, text, onPress, style }: ButtonProps) => {
    const backgroundColor = type === 'primary' ? '#3F78D8' : type === 'secondary' ? '#212E37' : 'red';
    const textColor = type === 'primary' ? 'white' : type === 'secondary' ? '#FAF4EC' : 'white';
    const buttonWidth = size === 's' ? '25%' : size === "m" ? '50%' : "100%";
    const height = size === "s" ? 30 : size === "m" ? 40 : 60;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor, width: buttonWidth, height }, style]}
        >
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        fontStyle: 'italic',
        margin: 5,
        paddingVertical: 5,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    text: {
        fontWeight: 'bold',
    }
});

export default Button;
