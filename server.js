const express=require('express')
const app=express()
const bodyParser=require('body-parser');
const MongoClient=require('mongodb').MongoClient
let alert=require('alert')
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/Footwear',(err,database)=>{
    if(err)return console.log(err);
    db=database.db('Footwear')
    app.listen(5000,()=>{
        console.log('Listening at post number 5000')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('LadiesFootwear').find().toArray((err,result)=>{
        if(err) return console.log(err);
    res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>
{
    res.render('add.ejs')
})

app.get('/updatestock',(req,res)=>
{
    res.render('update.ejs')
})
app.get('/deleteproduct',(req,res)=>
{
    res.render('delete.ejs')
})
app.post('/AddData',(req,res)=>{
    db.collection('LadiesFootwear').save(req.body,(err,result)=>{
        if(err) return alert("Entered ID already exists, please enter another ID") 
        res.redirect('/')
        if(!err) return alert(req.body.pid+" Product Added")
        res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    db.collection('LadiesFootwear').find().toArray((err,result) =>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++)
        {
            if(result[i].pid==req.body.pid)
            {   
                console.log(req.body.pid)
                s=result[i].stock
                break
            }
        }
        db.collection('LadiesFootwear').findOneAndUpdate({pid:req.body.pid},{
            $set: {stock: (parseInt(s) + parseInt(req.body.stock))+""}},{sort: {_id: -1}},
            (err,result)=>{
                if(err)
                return res.send(err)
                console.log(req.body.pid+' stock updated')
                res.redirect('/')
            })
        })
        alert(req.body.pid+" Stock Updated")
    })
    

       app.post('/delete', (req,res)=>{
        db.collection('LadiesFootwear').findOneAndDelete({pid: req.body.pid}, (err,result)=>{
          if(err) return console.log(err)
        res.redirect('/')
        })
        alert(req.body.pid+" Product Deleted")
      })