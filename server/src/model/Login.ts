import { LoginProvider } from './LoginProvider';

export class Login {
    id: string;
    type: LoginProvider;

    constructor(id: string, type: LoginProvider) {
        this.id = id;
        this.type = type;
    }
}
