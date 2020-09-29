import * as Act from "actions";

const initState = {
  account: "123"
};
export default function app(state = initState, action) {
  switch (action.type) {
    case Act.LOGIN:
      return Object.assign({}, state, {
        ...action.params
      });
    default:
      return state;
  }
}