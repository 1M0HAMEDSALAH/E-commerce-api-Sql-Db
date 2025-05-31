// reportEntity.js
module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        SiD: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        latitude: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        description: DataTypes.STRING,
        houseId: DataTypes.INTEGER,
        hajjDataId: DataTypes.INTEGER,
        hajjName: DataTypes.STRING,
        hajjCount: DataTypes.INTEGER,
        nationalityId: DataTypes.INTEGER,
        reporterName: DataTypes.STRING,
        reporterPhone: DataTypes.STRING,
        houseName: DataTypes.STRING,
        notes: DataTypes.TEXT,
        assigneeParty_SID: DataTypes.INTEGER,
        pilgrim_SID: DataTypes.INTEGER,
        cityId: DataTypes.INTEGER,
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'reports',
        timestamps: false,
    });

    Report.associate = models => {
        // العلاقة بين البلاغ والمستخدم (User)
        Report.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Report;
};
  