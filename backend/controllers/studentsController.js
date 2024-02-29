// const data = {
//     students : require('../models/students.json'),
//     setStudent : function(data){ this.students = data }
// }

const Student = require('../models/Student');


// for retreiving all students data
const getStudents = async (req,res) => {
    // res.json(data.students)
    
    const students = await Student.find();
    
    if(!students) return res.status(204).send({ "message": "No student found" });
    res.json(students);
}

// for handling the new student registration
const createStudent = async (req,res) => {
    // const student = {
    //     id : data.students.length ? data.students[data.students.length - 1].id + 1 : 1,
    //     first_name : req.body.first_name,
    //     last_name : req.body.last_name
    // }
    
    // if(!student.first_name || !student.last_name){
    //     return res.status(400).json({
    //         message : "First Name or Last Name are not provided."
    //     })
    // }

    // data.setStudent([...data.students,student]);
    // res.status(201).json(data.students);

    
    if(!req?.body?.firstname || !req?.body?.lastname){
        return res.status(400).json({
            message : "First Name or Last Name are not provided."
        })
    }
    
    try{
        const result = await Student.create({
            firstname : req.body.firstname,
            lastname : req.body.lastname
        })
        res.status(201).json(result);
    }
    catch(err){
        console.log(err);
    }



}

// for updating the existing user details
const updateStudent = async (req,res) => {
    // const student = data.students.find( (stu) => stu.id === parseInt(req.body.id));
    
    
    if(!req?.body?.id){
        return res.status(400).json({
            'message' :  `Id is required`
        });
    }
    
    const student = await Student.findOne( {_id : req.body.id} ).exec();
    if(!student){
        return res.status(204).json({
            message :  `Student with ${req.body.id} ID not found.`
        });
    }
    
    if(req.body?.firstname){
        student.firstname = req.body.firstname;
    }
    if(req.body?.lastname){
        student.lastname = req.body.lastname;
    }

    // const filteredArray = data.students.filter((stu)=> stu.id !== parseInt(req.body.id));
    // const unsortedAray = [...filteredArray,student];

    // data.setStudent(unsortedAray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

    const result = await student.save();
    res.status(200).json(result);

}

// for deleting the exisiting student
const deleteStudent = async (req,res) => {
    // const student = data.students.find(stu => stu.id === parseInt(req.body.id));

    
    if(!req?.body?.id){
        return res.stauts(400).json({
            "message" : `Id is required.`
        });
    }

    const student = await Student.findOne( {_id : req.body.id} ).exec();
    if(!student){
        return res.stauts(204).json({
            "message" : `Student with ${req.body.id} ID not found`
        });
    }
    
    // const filteredArray = data.students.filter(stu => stu.id !== parseInt(req.body.id));
    // data.setStudent([...filteredArray]);

    const result = await Student.deleteOne({ _id : req.body.id});

    res.status(200).json(result);
}

// for getting a single student detail based on student's ID
const getStudent = async (req,res) => {
    // const student = data.students.find((stu)=> stu.id === parseInt(req.params.id));
    if(!req?.params?.id){
        return res.status(400).json({
            "message" : "Id is required"
        });
    }

    const student = await Student.findOne( { _id : req.params.id } ).exec();

    if(!student){
        return res.status(204).json({
            message : `Student with ${req.params.id} not found`
        });
    }

    res.json(student);
}

module.exports = {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudent
}