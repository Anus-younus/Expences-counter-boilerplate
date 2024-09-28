export type UserType = {
    name: string,
    email: string,
    uid: string | undefined
}

export type ExpenceType = {
    title: string,
    amount: string,
    category: string,
    note: string
}

export type UpdatedExpenceType = {
    id: string,
    title: string,
    amount: string,
    category: string,
    note: string
}