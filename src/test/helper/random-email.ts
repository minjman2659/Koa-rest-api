import { nanoid } from 'nanoid';

const randomEmail = () => `${nanoid(7)}@gmail.com`;

export default randomEmail;
