import { convertIntoKeepGetParams } from '@utils';
import formRegistration from './fragments/form/formRegistration';
import gallery from './fragments/gallery/gallery';
import randomProfiles from './fragments/gallery/randomProfiles';
import initConfig from './fragments/initConfig';
import latestArticles from './fragments/latestArticles';
import meta from './fragments/meta';
import socialLogin from './fragments/socialLogin';
import user from './fragments/user';
import registerUser from './mutations/form/registerUser';
import remindPassword from './mutations/form/remindPassword';

interface IAPI {
    queries: any[];
    mutations: any[];
    subscriptions: any[];
    requester: any;
    builder: any;
}

export default class API implements IAPI {
    private queries: any[] = [];
    private mutations: any[] = [];
    private subscriptions: any[] = [];
    private requester;
    private builder;
    constructor(requester, queryBuilder) {
        this.requester = requester;
        this.builder = queryBuilder;
    }
    public includeInitConfig() {
        this.includeQuery('initConfig', initConfig);
        return this;
    }
    public includeMetaTags(params: any) {
        const uri = params.currentUrl;
        const keepGetArgs = params.query ? convertIntoKeepGetParams(params.query) : '';
        this.includeQuery('meta', meta, {
            uri: {
                value: uri,
                required: true,
            },
            keepGet: {
                value: `[${keepGetArgs}]`,
                type: '[String!]',
            },
        });
        return this;
    }
    public includeTokenWithSocial(values) {
        const { socialNetworkName, accessToken } = values;
        this.includeQuery('socialLogin', socialLogin, {
            network: {
                value: socialNetworkName,
                type: 'SocNetEnum',
                required: true,
            },
            token: {
                value: accessToken,
                required: true,
            },
        });
        return this;
    }
    public includeFormRegistration() {
        this.includeQuery('formRegistration', formRegistration);
        return this;
    }
    public includeUser() {
        this.includeQuery('user', user);
        return this;
    }
    public includeGallery(page: number = 1) {
        this.includeQuery('gallery', gallery, {
            page: {
                value: Number(page),
                type: 'Int',
            },
        });
        return this;
    }
    public includeRandomProfiles(count: number) {
        this.includeQuery('randomProfiles', randomProfiles, {
            count: {
                value: count,
                required: true,
            },
        });
        return this;
    }
    public includeLatestArticles() {
        this.includeQuery('latestArticles', latestArticles);
        return this;
    }
    public registerUser(values: any) {
        const { name, email, plainPassword } = values;
        this.includeMutation('Registration', registerUser, {
            name: {
                value: name,
                required: true,
            },
            email: {
                value: email,
                type: 'Email',
                required: true,
            },
            plainPassword: {
                value: plainPassword,
                required: true,
            },
            acceptTerms: {
                value: 'YES',
                type: 'YesNoEnum',
                required: true,
            },
        });
        return this;
    }
    public remindPassword(email: string) {
        this.includeMutation('ResolvePassword', remindPassword, {
            userEmail: {
                value: email,
                type: 'Email',
                required: true,
            },
        });
        return this;
    }
    public makeRequest(operationType?: string, customHeaders?: any) {
        let query: any;
        switch (operationType) {
            case 'query':
                query = this.builder.buildQuery(this.queries);
                break;
            case 'mutation':
                query = this.builder.buildMutation(this.mutations);
                break;
            case 'subscription':
                query = this.builder.buildSubscription(this.subscriptions);
                break;
            default:
                query = this.builder.buildQuery(this.queries);
                break;
        }
        this.clearQueries();
        this.clearMutations();
        this.clearSubscriptions();
        return this.requester.makeRequest(query, customHeaders);
    }
    private includeQuery(name, fragments, vars?) {
        this.queries.push({
            operation: name,
            fields: fragments,
            variables: vars || {},
        })
    }
    private includeMutation(name, fragments, vars?) {
        this.mutations.push({
            operation: name,
            fields: fragments,
            variables: vars || {},
        })
    }
    private includeSubscription(name, fragments, vars?) {
        this.subscriptions.push({
            operation: name,
            fields: fragments,
            variables: vars || {},
        })
    }
    private clearQueries() {
        this.queries = [];
    }
    private clearMutations() {
        this.mutations = [];
    }
    private clearSubscriptions() {
        this.subscriptions = [];
    }
}
