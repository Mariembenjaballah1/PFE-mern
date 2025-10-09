
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assetApi';

export const useProjectEnvironments = (projectId: string | null) => {
  return useQuery({
    queryKey: ['project-environments', projectId],
    queryFn: async () => {
      if (!projectId || projectId === 'none') {
        return [];
      }
      
      console.log('🔍 Fetching environments for project:', projectId);
      
      const assets = await fetchAssets();
      console.log('📊 Total assets fetched:', assets.length);
      
      const projectAssets = assets.filter(asset => {
        // Gérer différents formats de projet
        const assetProject = asset.project || asset.projectName;
        
        console.log('🔍 Checking asset:', asset.name, 'with project:', assetProject);
        
        if (typeof assetProject === 'string') {
          const matches = assetProject === projectId;
          console.log('📝 String comparison:', assetProject, '===', projectId, '→', matches);
          return matches;
        }
        
        if (assetProject && typeof assetProject === 'object') {
          // Si c'est un objet avec _id ou id
          const projectObjId = (assetProject as any)._id || (assetProject as any).id;
          const matches = projectObjId === projectId;
          console.log('📝 Object comparison:', projectObjId, '===', projectId, '→', matches);
          return matches;
        }
        
        console.log('❌ No project match for asset:', asset.name);
        return false;
      });
      
      console.log('✅ Found project assets:', projectAssets.length);
      console.log('📋 Project assets details:', projectAssets.map(asset => ({
        name: asset.name,
        project: asset.project || asset.projectName,
        environment: asset.additionalData?.environment,
        vmInfo: asset.vmInfo,
        additionalData: asset.additionalData
      })));
      
      // Extraire les environnements avec plus de détails
      const environmentsWithDetails = projectAssets.map(asset => {
        const additionalData = asset.additionalData || {};
        const vmInfo = asset.vmInfo || {};
        
        // Vérifier les différentes sources d'environnement
        let detectedEnv = null;
        
        // 1. Environment direct dans additionalData
        if (additionalData.environment) {
          detectedEnv = additionalData.environment.toLowerCase();
          console.log(`🌍 Asset ${asset.name}: Direct environment = ${detectedEnv}`);
        }
        // 2. Vérifier les flags booléens dans vmInfo et additionalData
        else {
          const envFlags = [];
          
          // Vérifier dans vmInfo (only lowercase properties exist in VMInfo interface)
          if (vmInfo.prod) envFlags.push('production');
          if (vmInfo.pca) envFlags.push('pca');
          if (vmInfo.integration) envFlags.push('integration');
          if (vmInfo.infra) envFlags.push('infra');
          if (vmInfo.app) envFlags.push('app');
          if (vmInfo.db) envFlags.push('db');
          
          // Vérifier dans additionalData (can have any properties)
          if (additionalData.prod || additionalData.Prod) envFlags.push('production');
          if (additionalData.pca || additionalData.Pca) envFlags.push('pca');
          if (additionalData.integration || additionalData.Integration) envFlags.push('integration');
          if (additionalData.infra || additionalData.Infra) envFlags.push('infra');
          if (additionalData.app || additionalData.App) envFlags.push('app');
          if (additionalData.db || additionalData.DB) envFlags.push('db');
          
          if (envFlags.length > 0) {
            detectedEnv = envFlags[0]; // Prendre le premier trouvé
            console.log(`🌍 Asset ${asset.name}: Environment from flags = ${detectedEnv} (found: ${envFlags.join(', ')})`);
          }
        }
        
        // Si pas d'environnement trouvé, utiliser production par défaut
        if (!detectedEnv) {
          detectedEnv = 'production';
          console.log(`🌍 Asset ${asset.name}: No environment found, defaulting to production`);
        }
        
        return {
          asset: asset.name,
          environment: detectedEnv,
          source: additionalData.environment ? 'direct' : 'flags'
        };
      });
      
      console.log('🎯 Environment details per asset:', environmentsWithDetails);
      
      // Extraire les environnements uniques
      const environments = [...new Set(
        environmentsWithDetails.map(item => item.environment)
      )].filter(env => env); // Filtrer les valeurs vides
      
      console.log('🎯 Final unique environments for project:', environments);
      
      return environments;
    },
    enabled: !!projectId && projectId !== 'none',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
