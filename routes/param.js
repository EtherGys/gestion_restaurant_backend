const express = require('express');
const Param = require('../model/Param');
const router = express.Router();
const auth = require('../middleware/authentification');

router.post("/create", async (req, res) => {
    const {paramName, value} = req.body;
    
    try {            
            const newParam = new Param({
                paramName, 
                value
            });

            await newParam.save();            
            res.status(201).send("Param created successfully");
       
    } catch (error) {
        console.log(error);
        
        res.status(400).json({error});
    }
}
);

router.patch("/update", auth, async (req, res) => {
    const {params } = req.body;
 
    try {
        params.forEach(async (param) => {
           const par =  await Param.findByIdAndUpdate(param._id, {
                value: param.value, 
                updatedAt: new Date() });                
      });
        
        res.status(200).json(params);
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
}
);

router.get("/all", auth, async (req, res) => {
    try {
        if (req.user.role.includes("admin")) {
            const params = await Param.find();
            res.status(200).json(params);
        } else {
            res.status(401).send("Access forbidden");
        }
    } catch (error) {
        console.log(error);
        
        res.status(400).json(error);
    }
}
);

module.exports = router;