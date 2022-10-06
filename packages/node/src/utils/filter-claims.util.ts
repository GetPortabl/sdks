import { JSONPath } from 'jsonpath-plus';
import set from 'lodash.set';

import {
  IKYCClaimsInput,
  ILabeledDisplayMappingObjectWithPath,
  IOutputDescriptor,
  LabeledDisplayMappingObjectType,
} from '../interfaces';

function isPropertyWithPath(
  property: LabeledDisplayMappingObjectType,
): property is ILabeledDisplayMappingObjectWithPath {
  return (property as ILabeledDisplayMappingObjectWithPath).path !== undefined;
}

const findClaimFromPath = ({
  claims,
  path,
}: {
  claims: IKYCClaimsInput;
  path: ILabeledDisplayMappingObjectWithPath['path'];
}) => {
  const credential = {
    credentialSubject: claims,
  };
  let claim;

  for (let i = 0; i < path.length; i += 1) {
    const pathEntry = path[i];
    const [firstMatchedClaim] = JSONPath<
      Array<{ path: string; value: string }>
    >({
      path: pathEntry,
      json: credential,
      resultType: 'all',
    });

    if (firstMatchedClaim) {
      claim = firstMatchedClaim;

      break;
    }
  }

  return claim;
};

const filterClaimsWithProperties = ({
  claims,
  properties,
}: {
  claims: IKYCClaimsInput;
  properties: Array<LabeledDisplayMappingObjectType>;
}): IKYCClaimsInput =>
  properties.reduce((acc, property) => {
    if (isPropertyWithPath(property)) {
      const claim = findClaimFromPath({ claims, path: property.path });

      if (claim) {
        const [, strippedClaimPath] = claim.path.split(
          "$['credentialSubject']",
        );
        set(acc, strippedClaimPath, claim.value);
      }
    }

    return acc;
  }, {} as IKYCClaimsInput);

export const filterClaims = ({
  claims,
  outputDescriptors,
}: {
  claims: IKYCClaimsInput;
  outputDescriptors: Array<IOutputDescriptor>;
}): IKYCClaimsInput => {
  // TODO: handle returning array of claims when there is more than 1 vc
  const [firstClaims] = outputDescriptors.reduce((acc, outputDescriptor) => {
    const properties = outputDescriptor.display?.properties;
    if (properties) {
      return [
        ...acc,
        filterClaimsWithProperties({
          claims,
          properties,
        }),
      ];
    }

    return acc;
  }, [] as Array<IKYCClaimsInput>);

  return firstClaims;
};
