type action =
  | AddAttributePoint(int)
  | RemoveAttributePoint(int)
  | AddLifePoint
  | RemoveLifePoint
  | AddArcaneEnergyPoint
  | RemoveArcaneEnergyPoint
  | AddKarmaPoint
  | RemoveKarmaPoint
  | AddLostLifePoint
  | RemoveLostLifePoint
  | AddLostLifePoints(int)
  | AddBoughtBackArcaneEnergyPoint
  | RemoveBoughtBackArcaneEnergyPoint
  | AddLostArcaneEnergyPoint
  | RemoveLostArcaneEnergyPoint
  | AddLostArcaneEnergyPoints(int)
  | AddBoughtBackKarmaPoint
  | RemoveBoughtBackKarmaPoint
  | AddLostKarmaPoint
  | RemoveLostKarmaPoint
  | AddLostKarmaPoints(int)
  | SetAttributeAdjustment(int);

// export const addAttributePoint = (id: string): ReduxAction<Promise<void>> =>
//   async (dispatch, getState) => {
//     const state = getState ()
//     const wiki_attributes = getWikiAttributes (state)
//     const mhero = getCurrentHeroPresent (state)
//     const mhero_attributes = fmapF (mhero) (HeroModel.A.attributes)
//
//     const missingAPForInc =
//       pipe_ (
//         mhero,
//         bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
//         join,
//         liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
//                                                        (bind (mhero_attributes)
//                                                              (lookup (id))))
//                (lookup (id) (wiki_attributes)),
//         join
//       )
//
//     if (isNothing (missingAPForInc)) {
//       dispatch<AddAttributePointAction> ({
//         type: ActionTypes.ADD_ATTRIBUTE_POINT,
//         payload: {
//           id,
//         },
//       })
//     }
//     else {
//       await dispatch (addNotEnoughAPAlert (fromJust (missingAPForInc)))
//     }
//   }
//
// export const addLifePoint: ReduxAction<Promise<void>> =
//   async (dispatch, getState) => {
//     const state = getState ()
//     const mhero = getCurrentHeroPresent (state)
//
//     const missingAP =
//       pipe_ (
//         mhero,
//         bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
//         join,
//         liftM2 (pipe (
//
//                  // get AP for added points
//                  curryN (getAPForInc) ("D"),
//
//                  // AP are passed to result and result finally gets the available AP
//                  getMissingAP (getIsInCharacterCreation (state))
//                ))
//                (getAddedLifePoints (state)),
//         join
//       )
//
//     if (isNothing (missingAP)) {
//       dispatch<AddLifePointAction> ({
//         type: ActionTypes.ADD_LIFE_POINT,
//       })
//     }
//     else {
//       await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
//     }
//   }
//
// export const addArcaneEnergyPoint: ReduxAction<Promise<void>> =
//   async (dispatch, getState) => {
//     const state = getState ()
//     const mhero = getCurrentHeroPresent (state)
//
//     const missingAP =
//       pipe_ (
//         mhero,
//         bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
//         join,
//         liftM2 (pipe (
//
//                  // get AP for added points
//                  curryN (getAPForInc) ("D"),
//
//                  // AP are passed to result and result finally gets the available AP
//                  getMissingAP (getIsInCharacterCreation (state))
//                ))
//                (getAddedArcaneEnergyPoints (state)),
//         join
//       )
//
//     if (isNothing (missingAP)) {
//       dispatch<AddArcaneEnergyPointAction> ({
//         type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
//       })
//     }
//     else {
//       await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
//     }
//   }
//
// export const addKarmaPoint: ReduxAction<Promise<void>> =
//   async (dispatch, getState) => {
//     const state = getState ()
//     const mhero = getCurrentHeroPresent (state)
//
//     const missingAP =
//       pipe_ (
//         mhero,
//         bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
//         join,
//         liftM2 (pipe (
//
//                  // get AP for added points
//                  curryN (getAPForInc) ("D"),
//
//                  // AP are passed to result and result finally gets the available AP
//                  getMissingAP (getIsInCharacterCreation (state))
//                ))
//                (getAddedKarmaPoints (state)),
//         join
//       )
//
//     if (isNothing (missingAP)) {
//       dispatch<AddKarmaPointAction> ({
//         type: ActionTypes.ADD_KARMA_POINT,
//       })
//     }
//     else {
//       await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
//     }
//   }
//
// export const addBoughtBackAEPoint: ReduxAction<Promise<void>> =
//   async (dispatch, getState) => {
//     const state = getState ()
//     const mhero = getCurrentHeroPresent (state)
//
//     const missingAP =
//       pipe_ (
//         mhero,
//         bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
//         join,
//         bindF (getMissingAP (getIsInCharacterCreation (state))
//                             (2))
//       )
//
//     if (isNothing (missingAP)) {
//       dispatch<AddBoughtBackAEPointAction> ({
//         type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT,
//       })
//     }
//     else {
//       await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
//     }
//   }
//
// export const addBoughtBackKPPoint: ReduxAction<Promise<void>> =
//   async (dispatch, getState) => {
//     const state = getState ()
//     const mhero = getCurrentHeroPresent (state)
//
//     const missingAP =
//       pipe_ (
//         mhero,
//         bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
//         join,
//         bindF (getMissingAP (getIsInCharacterCreation (state))
//                             (2))
//       )
//
//     if (isNothing (missingAP)) {
//       dispatch<AddBoughtBackKPPointAction> ({
//         type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT,
//       })
//     }
//     else {
//       await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
//     }
//   }
