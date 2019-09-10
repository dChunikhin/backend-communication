import API from './API';
import QueryBuilder from './QueryBuilder/index';
import Requester from './Requester/index';

const requester = new Requester();
const builder = new QueryBuilder();

export default new API(requester, builder);
