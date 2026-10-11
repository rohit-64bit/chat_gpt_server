const bcrypt = require('bcryptjs');

class PasswordHandler {

    static async hashPassword(password) {
        // Implementation for hashing password

        if (!password) {
            throw new Error('Password is required');
        } else if (password.length < 8) {
            throw new Error('Password must be at least 8 characters long');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;

    }

    static async comparePassword(password, hashedPassword) {

        const isMatch = await bcrypt.compare(password, hashedPassword);

        return isMatch;

    }

}

module.exports = PasswordHandler;