/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import * as React from "react";
import { useMemo } from "react";
import { Label } from "@patternfly/react-core/dist/js/components/Label";
import { ArrowAltCircleRightIcon } from "@patternfly/react-icons/dist/js/icons/arrow-alt-circle-right-icon";
import { MiningField } from "@kie-tools/pmml-editor-marshaller";
import "./MiningSchemaFieldLabels.scss";
import { useValidationRegistry, ValidationEntry } from "../../../validation";
import { Builder } from "../../../paths";
import { ValidationIndicatorLabel } from "../../EditorCore/atoms";
import {
  areLowHighValuesRequired,
  isInvalidValueReplacementRequired,
  isMissingValueReplacementRequired,
} from "../../../validation/MiningSchema";

interface MiningSchemaFieldLabelsProps {
  index: number;
  modelIndex: number;
  field: MiningField;
  onEdit: () => void;
  onDelete: (updatedField: MiningField) => void;
  editing: boolean;
}

const MiningSchemaFieldLabels = (props: MiningSchemaFieldLabelsProps) => {
  const { index, modelIndex, field, onEdit, onDelete, editing } = props;

  const BasicMiningLabel = (name: string, value: any, onClose: () => void) => {
    return (
      <Label
        color="cyan"
        className="mining-schema-list__item__label"
        closeBtnProps={{ className: "ignore-onclickoutside" }}
        onClose={editing ? onClose : undefined}
        data-ouia-component-id={name}
        data-ouia-component-type="mining-label"
      >
        <strong>{name}:</strong>
        &nbsp;
        <span>{value}</span>
      </Label>
    );
  };

  const InvalidMiningLabel = (
    name: string,
    value: any,
    onClose: (() => void) | undefined,
    validations: ValidationEntry[]
  ) => {
    return (
      <ValidationIndicatorLabel
        validations={validations}
        cssClass="mining-schema-list__item__label"
        onClose={editing ? onClose : undefined}
      >
        <strong>{name}:</strong>
        &nbsp;
        <span>{value}</span>
      </ValidationIndicatorLabel>
    );
  };

  const MissingValueAwareMiningLabel = (
    name: string,
    value: any,
    isValueRequired: boolean,
    validations: ValidationEntry[],
    onClose: () => void
  ) => {
    return (
      <>
        {isValueRequired && value !== undefined && BasicMiningLabel(name, value, onClose)}
        {isValueRequired && value === undefined && InvalidMiningLabel(name, <em>缺失</em>, undefined, validations)}
        {!isValueRequired && value !== undefined && InvalidMiningLabel(name, value, onClose, validations)}
      </>
    );
  };

  const { validationRegistry } = useValidationRegistry();
  const validationsImportance = useMemo(
    () =>
      validationRegistry.get(
        Builder().forModel(modelIndex).forMiningSchema().forMiningField(index).forImportance().build()
      ),
    [modelIndex, index, field]
  );

  const validationsLowValue = useMemo(
    () =>
      validationRegistry.get(
        Builder().forModel(modelIndex).forMiningSchema().forMiningField(index).forLowValue().build()
      ),
    [modelIndex, index, field]
  );
  const validationsHighValue = useMemo(
    () =>
      validationRegistry.get(
        Builder().forModel(modelIndex).forMiningSchema().forMiningField(index).forHighValue().build()
      ),
    [modelIndex, index, field]
  );
  const _areLowHighValuesRequired = useMemo(() => areLowHighValuesRequired(field.outliers), [modelIndex, index, field]);

  const validationsMissingValueReplacement = useMemo(
    () =>
      validationRegistry.get(
        Builder().forModel(modelIndex).forMiningSchema().forMiningField(index).forMissingValueReplacement().build()
      ),
    [modelIndex, index, field]
  );
  const _isMissingValueReplacementRequired = useMemo(
    () => isMissingValueReplacementRequired(field.missingValueTreatment),
    [modelIndex, index, field]
  );

  const validationsInvalidValueReplacement = useMemo(
    () =>
      validationRegistry.get(
        Builder().forModel(modelIndex).forMiningSchema().forMiningField(index).forInvalidValueReplacement().build()
      ),
    [modelIndex, index, field]
  );
  const _isInvalidValueReplacementRequired = useMemo(
    () => isInvalidValueReplacementRequired(field.invalidValueTreatment),
    [modelIndex, index, field]
  );

  return (
    <>
      {field.usageType !== undefined &&
        BasicMiningLabel("用法类型", field.usageType, () =>
          onDelete({
            ...field,
            usageType: undefined,
          })
        )}

      {field.optype !== undefined &&
        BasicMiningLabel("操作类型", field.optype, () =>
          onDelete({
            ...field,
            optype: undefined,
          })
        )}

      {field.importance !== undefined && (
        <>
          {validationsImportance.length === 0 &&
            BasicMiningLabel("重要性", field.importance, () =>
              onDelete({
                ...field,
                importance: undefined,
              })
            )}
          {validationsImportance.length > 0 &&
            InvalidMiningLabel(
              "重要性",
              field.importance,
              () => onDelete({ ...field, importance: undefined }),
              validationsImportance
            )}
        </>
      )}

      {field.outliers !== undefined &&
        BasicMiningLabel("异常值", field.outliers, () =>
          onDelete({
            ...field,
            outliers: undefined,
          })
        )}

      {MissingValueAwareMiningLabel("低值", field.lowValue, _areLowHighValuesRequired, validationsLowValue, () =>
        onDelete({
          ...field,
          lowValue: undefined,
        })
      )}

      {MissingValueAwareMiningLabel(
        "高值",
        field.highValue,
        _areLowHighValuesRequired,
        validationsHighValue,
        () =>
          onDelete({
            ...field,
            highValue: undefined,
          })
      )}

      {field.missingValueTreatment !== undefined &&
        BasicMiningLabel("缺失值处理", field.missingValueTreatment, () =>
          onDelete({
            ...field,
            missingValueTreatment: undefined,
          })
        )}

      {MissingValueAwareMiningLabel(
        "缺失值替换",
        field.missingValueReplacement,
        _isMissingValueReplacementRequired,
        validationsMissingValueReplacement,
        () =>
          onDelete({
            ...field,
            missingValueReplacement: undefined,
          })
      )}

      {field.invalidValueTreatment !== undefined &&
        BasicMiningLabel("无效值处理", field.invalidValueTreatment, () =>
          onDelete({
            ...field,
            invalidValueTreatment: undefined,
          })
        )}

      {MissingValueAwareMiningLabel(
        "无效值替换",
        field.invalidValueReplacement,
        _isInvalidValueReplacementRequired,
        validationsInvalidValueReplacement,
        () =>
          onDelete({
            ...field,
            invalidValueReplacement: undefined,
          })
      )}

      {editing && (
        <Label
          className="mining-schema-list__item__label"
          variant="outline"
          color="cyan"
          href="#"
          icon={<ArrowAltCircleRightIcon />}
          onClick={(event) => {
            event.preventDefault();
            onEdit();
          }}
          data-ouia-component-id="edit-properties"
          data-ouia-component-type="mf-label"
        >
          编辑属性
        </Label>
      )}
    </>
  );
};

export default MiningSchemaFieldLabels;
