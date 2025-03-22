import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import dictionary from "./dictionary";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import lesson from "./lesson";
import { navbar } from "./navbar";
import { page } from "./page";
import { redirect } from "./redirect";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [
  blog,
  page,
  faq,
  author,
  redirect,
  lesson,
  dictionary,
  ...singletons,
];
