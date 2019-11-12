public class Exect{

	public static void main(String args[]){
		System.out.println("java Exect <n>");
		int n=1;
		if (args.length>0){
			n=Integer.parseInt(args[0]);
		}
		Agents a = new Agents();
		
		for(int i=0;i<n;i++){
			Thread t = new Thread(a);
			t.start();
		}
	}
}
