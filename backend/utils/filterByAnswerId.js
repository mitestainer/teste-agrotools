const filterById = (request, data) => {
    if (request.params.id) {
        const dataFromId = data.filter(answer => answer.question_id == request.params.id)
        return dataFromId.length ? dataFromId : { msg: 'No such id.' }
    } else {
        return !data.length ? { msg: 'No data has been found.' } : data
    }
}

module.exports = filterById