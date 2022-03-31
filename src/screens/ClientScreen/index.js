import React from 'react';
import { Actions } from "./Actions";
import LogingView from "./View";

const ClientContainer = ({ ...props }) => {
	const actions = Actions();
	return <LogingView {...props} {...actions} />;
};

export default ClientContainer;
