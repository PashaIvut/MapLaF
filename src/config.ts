if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is required! Check .env file.")
}

const config = {
    port: 4000,
    mongoUrl: process.env.MONGO_URL,
}

export { config }