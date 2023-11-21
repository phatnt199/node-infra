import { FilteredAdapter, Model, Helper } from 'casbin';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import { BaseDataSource } from '@/base/base.datasource';
import { ApplicationLogger, LoggerFactory } from './logger.helper';
import { getError } from '..';
import { EnforcerDefinitions } from '@/common/constants';

export interface EnforcerFilterValue {
  principalType: string;
  principalValue: string | number | object;
}

// -----------------------------------------------------------------------------------------
export class CasbinLBAdapter implements FilteredAdapter {
  private logger: ApplicationLogger;
  private datasource: BaseDataSource;

  constructor(datasource: BaseDataSource) {
    this.logger = LoggerFactory.getLogger([CasbinLBAdapter.name]);
    this.datasource = datasource;
  }

  // -----------------------------------------------------------------------------------------
  generateGroupLine(rule: { userId: number; roleId: number }) {
    const { userId, roleId } = rule;
    const rs = [
      EnforcerDefinitions.PTYPE_GROUP,
      `${EnforcerDefinitions.PREFIX_USER}_${userId}`,
      `${EnforcerDefinitions.PREFIX_ROLE}_${roleId}`,
    ];
    return rs.join(',');
  }

  // -----------------------------------------------------------------------------------------
  async loadFilteredPolicy(model: Model, filter: EnforcerFilterValue): Promise<void> {
    if (filter?.principalType?.toLowerCase() === 'role') {
      throw getError({
        statusCode: 500,
        message: '[loadFilteredPolicy] Only "User" is allowed for filter principal type!',
      });
    }

    const aclQueries = [
      this.datasource.execute(`SELECT * FROM public."ViewAuthorizePolicy" WHERE subject=$1`, [
        `user_${filter.principalValue}`,
      ]),
    ];

    // Load role permission policies
    const userRoles = await this.datasource.execute(`SELECT * FROM public."UserRole" WHERE user_id=$1`, [
      filter.principalValue,
    ]);
    for (const userRole of userRoles) {
      const execution = this.datasource.execute(`SELECT * FROM public."ViewAuthorizePolicy" WHERE subject=$1`, [
        `role_${userRole.principal_id}`,
      ]);
      aclQueries.push(execution);
    }

    // Load policy lines
    const policyRs = flatten(await Promise.all(aclQueries));
    this.logger.debug('[loadFilteredPolicy] policyRs: %j | filter: %j', policyRs, filter);
    for (const el of policyRs) {
      if (!el) {
        continue;
      }

      el.policies?.forEach((policyLine: string) => {
        Helper.loadPolicyLine(policyLine, model);
        this.logger.debug('[loadFilteredPolicy] Load policy: %s', policyLine);
      });
    }

    // Load group lines
    for (const userRole of userRoles) {
      const groupLine = this.generateGroupLine({
        userId: get(userRole, 'user_id'),
        roleId: get(userRole, 'principal_id'),
      });

      if (!groupLine || isEmpty(groupLine)) {
        continue;
      }

      Helper.loadPolicyLine(groupLine, model);
      this.logger.debug('[loadFilteredPolicy] Load groupLine: %s', groupLine);
    }
  }

  // -----------------------------------------------------------------------------------------
  isFiltered(): boolean {
    return true;
  }

  // -----------------------------------------------------------------------------------------
  async loadPolicy(_: Model): Promise<void> {
    return;
  }

  // -----------------------------------------------------------------------------------------
  async savePolicy(model: Model): Promise<boolean> {
    this.logger.info('[savePolicy] Ignore save policy method with options: ', { model });
    return true;
  }

  // -----------------------------------------------------------------------------------------
  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    this.logger.info('[addPolicy] Ignore add policy method with options: ', { sec, ptype, rule });
  }

  // -----------------------------------------------------------------------------------------
  async removePolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    this.logger.info('[removePolicy] Ignore remove policy method with options: ', { sec, ptype, rule });
  }

  // -----------------------------------------------------------------------------------------
  async removeFilteredPolicy(sec: string, ptype: string, fieldIndex: number, ...fieldValues: string[]): Promise<void> {
    switch (ptype) {
      case EnforcerDefinitions.PREFIX_USER: {
        // Remove user policy
        break;
      }
      case EnforcerDefinitions.PREFIX_ROLE: {
        // Remove role policy
        break;
      }
      default: {
        break;
      }
    }

    this.logger.info('[removeFilteredPolicy] Ignore remove filtered policy method with options: ', {
      sec,
      ptype,
      fieldIndex,
      fieldValues,
    });
  }
}
