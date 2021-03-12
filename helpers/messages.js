module.exports.msg = (id, msg, username = null) => ({
    client_id: id,
    msg,
    username,
    date: new Date().toLocaleTimeString().slice(0, -3)
})
