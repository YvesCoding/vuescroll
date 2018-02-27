import map from './scrollMap'
export default {
    name: "rail",
    props: {
        type: {
            required: true,
            type: String
        },
        ops: {
            required: true,
            type: Object
        },
        state: {
            required: true,
            type: Object
        }
    }
}