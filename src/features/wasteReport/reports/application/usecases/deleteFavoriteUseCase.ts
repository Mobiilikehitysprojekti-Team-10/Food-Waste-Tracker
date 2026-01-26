import { favoritesRepository } from "../../data/favoritesRepository";

export async function deleteFavoriteUseCase(params: {
  favoriteId: string;
  ownerUid: string;
}) {
  await favoritesRepository.deleteFavorite(params.favoriteId, params.ownerUid);
}