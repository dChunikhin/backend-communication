import { mutation, query, subscription } from 'gql-query-builder';
import CustomQueryAdapter from './adapters/queryAdapter';

interface IQueryBuilder {
    adapter: any;
}

export default class QueryBuilder implements IQueryBuilder {
    private adapter: any = CustomQueryAdapter;
    public buildQuery(queries) {
        return query(queries, this.adapter);
    }
    public buildMutation(mutations) {
        return mutation(mutations);
    }
    public buildSubscription(subscriptions) {
        return subscription(subscriptions);
    }
}
