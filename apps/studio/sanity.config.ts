import { assist } from "@sanity/assist";
import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import {
  unsplashAssetSource,
  unsplashImageAsset,
} from "sanity-plugin-asset-source-unsplash";
import { iconPicker } from "sanity-plugin-icon-picker";
import { media, mediaAssetSource } from "sanity-plugin-media";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { Logo } from "./components/logo";
import { locations } from "./location";
import { presentationUrl } from "./plugins/presentation-url";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { createPageTemplate } from "./utils/helper";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const presentationOriginUrl = process.env.SANITY_STUDIO_PRESENTATION_URL;

// @ts-ignore - Suppressing version compatibility errors
export default defineConfig({
  name: "default",
  title: title ?? "Turbo Studio",
  projectId: projectId,
  icon: Logo,
  dataset: dataset ?? "production",
  plugins: [
    // @ts-ignore - Suppressing version compatibility errors
    presentationTool({
      resolve: {
        locations,
      },
      previewUrl: {
        origin: presentationOriginUrl ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/presentation-draft",
        },
      },
    }),
    // @ts-ignore - Suppressing version compatibility errors
    assist(),
    // @ts-ignore - Suppressing version compatibility errors
    structureTool({
      structure,
    }),
    // @ts-ignore - Suppressing version compatibility errors
    visionTool(),
    // @ts-ignore - Suppressing version compatibility errors
    iconPicker(),
    // @ts-ignore - Suppressing version compatibility errors
    media(),
    // @ts-ignore - Suppressing version compatibility errors
    presentationUrl(),
    // @ts-ignore - Suppressing version compatibility errors
    unsplashImageAsset(),
    // @ts-ignore - Suppressing version compatibility errors
    documentInternationalization({
      // Required configuration
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "es", title: "Spanish" },
        { id: "dk", title: "Danish" },
      ],
      schemaTypes: ["lesson", "homePage", "blog", "page", "blogIndex"],
      weakReferences: true,
    }),
  ],

  form: {
    image: {
      assetSources: (previousAssetSources) => {
        return previousAssetSources.filter(
          (assetSource) =>
            assetSource === mediaAssetSource ||
            assetSource === unsplashAssetSource,
        );
      },
    },
  },
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      const { type } = creationContext;
      if (type === "global") return [];
      return prev;
    },
  },
  // @ts-ignore - Suppressing version compatibility errors
  schema: {
    types: schemaTypes,
    templates: createPageTemplate(),
  },
});
