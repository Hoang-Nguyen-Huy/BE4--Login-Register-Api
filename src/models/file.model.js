const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const Local_Files = function(LocalFiles) {
    this.id = LocalFiles.id;
    this.diskPath = LocalFiles.diskPath;
    this.fileName = LocalFiles.fileName;
}

Local_Files.create = async (newFiles, result) => {
    
    //Generate a random UUID (v4)
    const uuid = crypto.randomUUID();

    //Hash the UUID with MD5
    const md5hash = crypto.createHash('md5').update(uuid).digest('hex');

    //Use md5hash as the userid in newFiles
    newFiles.id = md5hash;

    try {
        const createdFiles = await prisma.local_file.create({
            data: {
                id: newFiles.id,
                diskPath: newFiles.diskPath,
                fileName: newFiles.fileName
            }
        });

        console.log("created file: " , {id: newFiles.id, ...createdFiles });

        result(null, {...createdFiles});
    } catch(error) {
        console.error("Error creating user: ", error);
        result(error, null);
    }
}

Local_Files.findById = async(id) => {
    try {
        const file = await prisma.local_file.findUnique({
            where: {
                id
            }
        });
        return file;
    } catch(error) {
        console.error("Error finding file by id: ", error);
        throw error;
    }
};

Local_Files.findByName = async(filename) => {
    try {
        const file = await prisma.local_file.findFirst({
            where: {
                fileName: filename
            }
        });
        return file;
    } catch(error) {
        console.error("Error finding file by name: ", error);
        throw error;
    }
};

module.exports = Local_Files;