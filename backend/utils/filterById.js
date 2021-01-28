const filterById = (request, data) => {
    if (request.params.id) {
        const dataFromId = data.find(question => question.id == request.params.id)
        return dataFromId ? dataFromId : { msg: 'No such id.' }
    } else {
        return !data.length ? { msg: 'No question has been registered yet.' } : data
    }
}

module.exports = filterById