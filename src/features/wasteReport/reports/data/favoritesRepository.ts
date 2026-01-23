import { fetchFavorites } from "../../data/fetchFavorites";
import { fetchFavoriteDetails } from "../../data/fetchFavoriteDetails";
import { createFavorite } from "../../data/createFavorite";
import { deleteFavorite } from "../../data/deleteFavorite";

export const favoritesRepository = {
  fetchFavorites,
  fetchFavoriteDetails,
  createFavorite,
  deleteFavorite,
};