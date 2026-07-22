import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoginCredentials, User } from '../types/types';

const AUth_TOKEN_KEY = "kanban"
const USER_DATA_KEY = "Data-kanban"

export const authService = {
    async login (credentials: LoginCredentials): Promise<User | any> {

        await new Promise(resolve => setTimeout(resolve, 1000))

        if(credentials.email && credentials.password.length >= 8) {
            const user: User = {
                id: '1',
                email: credentials.email,
                name: credentials.email.split('@')[0],
                token: 'mock-jwt-token-' + Date.now(),
            }
            
            await AsyncStorage.setItem(AUth_TOKEN_KEY, user.token!)
            await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user))

            return user;
        }

       throw new Error("Invalid email or password");
    },

    async getStoreUser(): Promise<User | any> {
        try {
            const token = await AsyncStorage.getItem(AUth_TOKEN_KEY)
            const userData = await AsyncStorage.getItem(USER_DATA_KEY)

            if(token && userData){
                return JSON.parse(userData);
            }
            return null
        } catch (error) {
            console.error('Error getting stored user:', error)
            return null;
        }
    },

    async logout(): Promise<void> {
        try {
            await AsyncStorage.removeItem(AUth_TOKEN_KEY) 
            await AsyncStorage.removeItem(USER_DATA_KEY) 
        } catch (error) {
            console.error('Error during logot:', error)
        }
    },

    async validateToken(): Promise<boolean> {
        const token = await AsyncStorage.getItem(AUth_TOKEN_KEY)
        return !!token;
    }
}
