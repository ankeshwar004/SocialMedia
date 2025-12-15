export const protect = async (req, res, next) => {
    try {
        const auth = await req.auth(); 
        const { userId } = auth || {};

        if (!userId) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        req.userId = userId; 
        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
