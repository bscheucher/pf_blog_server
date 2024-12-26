import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

export default function coreMiddleware(app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(cors());
}
