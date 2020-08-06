import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BlogComment } from '../model/Comment';
import { CommentReply } from '../model/Reply';
import { getDateTime } from '../common/functions';
import { map, catchError } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';
import { EmailValidator } from '@angular/forms';
import { Environment } from '../../environments/environment.dev';

export interface Blog {
  id:number,
  heading: string,
  content: string,
  comments: BlogComment[],
  author: string,
  date: string,
  featuredImage: string
}
@Injectable({
  providedIn: 'root'
})


export class BlogService {

  public blogs: Blog[]
  public comments : BlogComment[];
  public baseUrl = Environment.baseUrl;
  dbBlogs
  users
  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/list`).pipe(
      map((res) => {
        this.dbBlogs = res['data'];
        //  this.addBlog('d','w','t')

        return this.dbBlogs;
    }))
  }

  getUsers(): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/users`).pipe(
      map((res) => {
        this.users = res['data'];
        return this.users;
    }))
  }

  getById(id): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/get-by-id?ab=${id}`).pipe(
      map((res) => {
        this.dbBlogs = res['data'];
        this.dbBlogs[0]['comments'] = [];
        this.getCommentByBlogId(id).subscribe(data => {
          this.dbBlogs[0].comments.push(...data);
          const commentIds = data.map(com => com.id);
          if(commentIds.length != 0) {
            // console.log(commentIds.toString());
            this.getRepliesByCommentId(commentIds).subscribe(replies => {
              // console.log(replies)
              for(let i=0; i<this.dbBlogs[0]['comments'].length; i++) {
                this.dbBlogs[0]['comments'][i]['replies'] = []
                for(let j=0; j<replies.length; j++) {
                  if(this.dbBlogs[0]['comments'][i].id == replies[j].comment_id) {
                    this.dbBlogs[0]['comments'][i]['replies'].push(replies[j])
                  }
                }
              }
            })
          }
        });
        return this.dbBlogs;
    }));
  }
  private getCommentByBlogId(id): Observable<any[]> {
    return this.http.get(`${this.baseUrl}/get-comment-by-blog-id?ab=${id}`).pipe(
      map((res) => {
        return res['data'];
    }))
  }
  private getRepliesByCommentId(commentIds) : Observable<any[]>{
    let params = commentIds.toString();
    return this.http.get(`${this.baseUrl}/get-replies?ab=${params}`).pipe(
      map((res) => {
        return res['data'];
    }))
  }

  addBlog(title,content,author,featuredImage) : Observable<Object> {
    let blog = { 
      heading: title, 
      content: content, 
      author : author  , 
      date: getDateTime(),
      featured_image : featuredImage
    }
    return this.http.post(`${this.baseUrl}/add-blog`,{data: blog})
  }

  addUser(userData) : Observable<Object> {
    let user = { 
      username: userData.name, 
      email : userData.email,
      password: userData.password, 
      role : {
        name:userData.role
      }, 
      status: userData.status,
    }
    return this.http.post(`${this.baseUrl}/signup`,user)
  }

  userLogin(uname,password) : Observable<Object> {
    let user = { 
      username: uname, 
      password: password,
    }
    return this.http.post(`${this.baseUrl}/signin`,user)
  }

  addComment(id,comment) {
    let currentComment= {
      text : comment,
      blog_id: id,
      status: 'approved',
      replies: [],
      user_id: 0,
      username: 'karthik',
      date: getDateTime()
    };
    return this.http.post(`${this.baseUrl}/add-comment`,{data: currentComment})

  }
  addReply(reply,comment:BlogComment) {
    let currentReply = {
      text: reply,
      comment_id: comment.id,
      username: 'Anonymous',
      time: getDateTime(),
      status: 'approved'
    }
    // this.blogs.find(blog => blog.id == comment.blog_id).comments
    //           .find(comment => comment.id == currentReply.comment_id).replies
    //           .push(currentReply);
    // localStorage.setItem("blogs", JSON.stringify(this.blogs))
    return this.http.post(`${this.baseUrl}/add-reply`,{data: currentReply})

  }

  deleteComment(blogComment:BlogComment) {
    let info = {
      table : 'comments',
      id : blogComment.id
    }
    // let latestComments = this.blogs.find(blog => blog.id == blogComment.blog_id).comments
    //           .filter(comment => comment.id != blogComment.id);
    // this.blogs.find(blog => blog.id == blogComment.blog_id).comments = latestComments;
    // localStorage.setItem("blogs", JSON.stringify(this.blogs))
    return this.http.put(`${this.baseUrl}/delete`,{data: info})


  }
  deleteBlog(blog) {
    let info = {
      table : 'blogs',
      id : blog.id
    }
    return this.http.put(`${this.baseUrl}/delete`,{data: info})


  }
  editComment(originalComment:BlogComment,newComment:string) {
    this.blogs.find(blog => blog.id == originalComment.blog_id).comments
    .find(comment => comment.id == originalComment.id).text = newComment;
    localStorage.setItem("blogs", JSON.stringify(this.blogs))

  }

  // addBlog(title, content, author){
  //   let blog : Blog = { 
  //     heading: title, 
  //     content: content, 
  //     author : author  , 
  //     id : Math.floor(Math.random() * (100 - 10 + 1) ) + 10,
  //     date: getDateTime(),
  //     comments: []
  //   }
  //   if(localStorage.getItem("blogs")){
  //     this.blogs = JSON.parse(localStorage.getItem("blogs"))
  //     this.blogs.push(blog)
  //     localStorage.setItem("blogs", JSON.stringify(this.blogs))
  //   } else {
  //       let blogs = [];
  //       blogs.push(blog);
  //       localStorage.setItem("blogs", JSON.stringify(blogs))
  //   }
  // }

  removeBlog(blog){
    this.blogs = JSON.parse(localStorage.getItem("blogs"))
    let index = this.blogs.indexOf(blog)
    this.blogs.splice(index, 1)
    localStorage.setItem("blogs", JSON.stringify(this.blogs))
  }
}
