import { Server } from 'http';

const chai = require('chai');
const expect = chai.expect;

const {app, runServer, closeServer} = require('../app')

describe('blogs', function(){
    before(function() {
        return runServer;
    });

    after(function() {
        return closeServer;
    });


    it('should be able to GET a blog post', function(){
        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            //expect(res.body.length).to.be.at.least(1);
            res.body.forEach(function(item){
                expect(item).to.be.a('object');
                expect(item).to.include.keys(['id', 'title', 'content', 'author', 'publishDate']);
            });
        });
    })

    it('should be able to POST a blog post', function(){
        const newPost = {
            title: 'title1', 
            content: 'content1', 
            author: 'author1', 
            publishDate: 'date1'
        };

        return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
        });
    });


    it('should be able to PUT an update on a blog post', function(){
        const updatePost = {
            title: 'title1',
            content: 'conten1',
            author: 'author1',
            publishDate: 'date1'
       };

        return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            updatePost.id = res.body[0].id;

            return chai.request(app)
            .put(`/blog-posts/${updatePost.id}`)
            .send(updatePost)
        })

        .then(function(res){
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
            expect(res.body).to.deep.equal(updatePost);
        });
    });

    it('should be able to DELETE a blog post', function(){
        chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            return chai.request(app)
            .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res){
            expect(res).to.have.status(204);
        });
    });
});