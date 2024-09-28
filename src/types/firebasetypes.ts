type UserType = {
    name: string,
    email: string,
    uid: string | undefined
}

type ExpenceType = {
    title: string,
    amount: string,
    category: string,
    note: string
}

type UpdatedExpenceType = {
    id: string,
    title: string,
    amount: string,
    category: string,
    note: string
}