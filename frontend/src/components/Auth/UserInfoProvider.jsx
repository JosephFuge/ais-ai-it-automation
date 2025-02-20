import { Context, createContext, useState } from "react";

const CURRENT_USER_KEY = "CurrentUserKey";
const AUTH_TOKEN_KEY = "AuthTokenKey";

/*
	 interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}
*/

const defaultUserInfo = {
	currentUser: null,
	displayedUser: null,
	authToken: null,
	updateUserInfo: (
		currentUser,
		displayedUser,
		authToken,
		remember = false
	) => { },
	clearUserInfo: () => { },
	setDisplayedUser: () => { },
};

const UserInfoContext = createContext(defaultUserInfo);

export function UserInfoProvider(children) {
	const saveToLocalStorage = (
		currentUser,
		authToken
	) => {
		localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
		localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
	};

	const retrieveFromLocalStorage = () => {
		const loggedInUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
		const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

		if (!!loggedInUser && !!authToken) {
			return {
				currentUser: loggedInUser,
				displayedUser: loggedInUser,
				authToken: authToken,
			};
		} else {
			return { currentUser: null, displayedUser: null, authToken: null };
		}
	};

	const clearLocalStorage = () => {
		localStorage.removeItem(CURRENT_USER_KEY);
		localStorage.removeItem(AUTH_TOKEN_KEY);
	};

	const [userInfo, setUserInfo] = useState({
		...defaultUserInfo,
		...retrieveFromLocalStorage(),
	});

	const updateUserInfo = (
		currentUser,
		displayedUser,
		authToken,
		remember
	) => {
		setUserInfo({
			...userInfo,
			currentUser: currentUser,
			displayedUser: displayedUser,
			authToken: authToken,
		});

		if (remember) {
			saveToLocalStorage(currentUser, authToken);
		}
	};

	const clearUserInfo = () => {
		setUserInfo({
			...userInfo,
			currentUser: null,
			displayedUser: null,
			authToken: null,
		});
		clearLocalStorage();
	};

	const setDisplayedUser = (user) => {
		setUserInfo({ ...userInfo, displayedUser: user });
	};

	return (
		<UserInfoContext.Provider
			value={{
				...userInfo,
				updateUserInfo: updateUserInfo,
				clearUserInfo: clearUserInfo,
				setDisplayedUser: setDisplayedUser,
			}}
		>
			{children}
		</UserInfoContext.Provider>
	);
};

export default UserInfoProvider;
