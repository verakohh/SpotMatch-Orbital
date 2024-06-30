import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext("");


// const ThemeProvider = ({ children }) => {
//     const [theme, setTheme] = useState('light');
  
//     const toggleTheme = () => {
//       setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
//     };
  
//     return (
//       <ThemeContext.Provider value={{ theme, toggleTheme }}>
//         {children}
//       </ThemeContext.Provider>
//     );
//   };
  
//   const useTheme = () => {
//     return useContext(ThemeContext);
//   };
  
//   export { ThemeProvider, useTheme };


// export const ThemeProvider = ({ children }) => {
//   const colorScheme = useColorScheme();
//   const [isDark, setIsDark] = useState(colorScheme === 'dark');

//   const lightTheme = {
//     background: '#FAF4EC',
//     text: '#000',
//   };

//   const darkTheme = {
//     background: '#111e26',
//     text: '#fff',
//   };

//   const theme = isDark ? darkTheme : lightTheme;

//   useEffect(() => {
//     setIsDark(colorScheme === 'dark');
//   }, [colorScheme]);

//   return (
//     <ThemeContext.Provider value={{ theme, isDark, setIsDark }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);
