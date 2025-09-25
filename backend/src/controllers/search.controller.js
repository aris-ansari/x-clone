import User from "../models/user.model.js";

// Escape regex special chars to avoid injection / broken patterns
function escapeRegex(str = '') {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const searchUsers = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) return res.json([]);

        const safe = escapeRegex(q);
        // ^prefix match, case-insensitive
        const regex = new RegExp('^' + safe, 'i');

        const users = await User.find({ userName: { $regex: regex } })
            .limit(10)
            .select('userName fullName profileImg')
            .lean();
        // .lean() returns plain JS objects for slightly better performance.

        return res.json(users);
    } catch (error) {
        console.error("Error in searchUsers controller", error.message);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}